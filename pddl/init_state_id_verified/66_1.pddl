(define (problem generated)
  (:domain manip)
  (:objects
    office_02 office_05 office_08 tool_02 - item
  )
  (:init
    (clear office_02)
    (clear office_05)
    (clear office_08)
    (clear tool_02)
    (handempty)
    (ontable office_02)
    (ontable office_05)
    (ontable office_08)
    (ontable tool_02)
  )
  (:goal (and))
)
