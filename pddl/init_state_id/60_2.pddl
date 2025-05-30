(define (problem scene1)
  (:domain manip)
  (:objects
    tool_04 - item
    tool_05 - item
    tool_06 - item
    tool_07 - item
    tool_09 - item
  )
  (:init
    (ontable tool_04)
    (ontable tool_05)
    (ontable tool_06)
    (ontable tool_07)
    (ontable tool_09)
    (clear tool_04)
    (clear tool_05)
    (clear tool_06)
    (clear tool_07)
    (clear tool_09)
    (handempty)
  )
  (:goal (and ))
)