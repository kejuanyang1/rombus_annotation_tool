(define (problem scene1)
  (:domain manip)
  (:objects
    tool_02 - item
    tool_03 - item
    tool_08 - item
    tool_09 - item
    container_05 - container
  )
  (:init
    (ontable tool_02)
    (ontable tool_03)
    (ontable tool_08)
    (ontable tool_09)
    (ontable container_05)
    (clear tool_02)
    (clear tool_03)
    (clear tool_08)
    (clear tool_09)
    (clear container_05)
    (handempty)
  )
  (:goal (and ))
)