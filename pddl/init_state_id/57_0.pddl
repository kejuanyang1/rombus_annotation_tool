(define (problem scene1)
  (:domain manip)
  (:objects
    tool_04 - item
    tool_06 - item
    tool_07 - item
    tool_08 - item
    tool_09 - item
    container_04 - container
    container_05 - container
  )
  (:init
    (ontable tool_04)
    (ontable tool_06)
    (ontable tool_07)
    (ontable tool_08)
    (ontable tool_09)
    (ontable container_04)
    (ontable container_05)
    (clear tool_04)
    (clear tool_06)
    (clear tool_07)
    (clear tool_08)
    (clear tool_09)
    (clear container_04)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)